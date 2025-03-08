import json

import pulumi
import pulumi_aws as aws

# Configuration
config = pulumi.Config()
app_name = "coding-challenge"
environment = pulumi.get_stack()

# Create a VPC for the application (included in free tier)
vpc = aws.ec2.Vpc(
    f"{app_name}-vpc",
    cidr_block="10.0.0.0/16",
    enable_dns_hostnames=True,
    enable_dns_support=True,
    tags={
        "Name": f"{app_name}-vpc",
    },
)

# Create public and private subnets
public_subnet_a = aws.ec2.Subnet(
    f"{app_name}-public-subnet-a",
    vpc_id=vpc.id,
    cidr_block="10.0.1.0/24",
    availability_zone=f"{aws.config.region}a",
    map_public_ip_on_launch=True,
    tags={
        "Name": f"{app_name}-public-subnet-a",
    },
)

public_subnet_b = aws.ec2.Subnet(
    f"{app_name}-public-subnet-b",
    vpc_id=vpc.id,
    cidr_block="10.0.2.0/24",
    availability_zone=f"{aws.config.region}b",
    map_public_ip_on_launch=True,
    tags={
        "Name": f"{app_name}-public-subnet-b",
    },
)

private_subnet_a = aws.ec2.Subnet(
    f"{app_name}-private-subnet-a",
    vpc_id=vpc.id,
    cidr_block="10.0.3.0/24",
    availability_zone=f"{aws.config.region}a",
    tags={
        "Name": f"{app_name}-private-subnet-a",
    },
)

private_subnet_b = aws.ec2.Subnet(
    f"{app_name}-private-subnet-b",
    vpc_id=vpc.id,
    cidr_block="10.0.4.0/24",
    availability_zone=f"{aws.config.region}b",
    tags={
        "Name": f"{app_name}-private-subnet-b",
    },
)

# Create an internet gateway
igw = aws.ec2.InternetGateway(
    f"{app_name}-igw",
    vpc_id=vpc.id,
    tags={
        "Name": f"{app_name}-igw",
    },
)

# Create a route table for public subnets
public_rt = aws.ec2.RouteTable(
    f"{app_name}-public-rt",
    vpc_id=vpc.id,
    routes=[
        aws.ec2.RouteTableRouteArgs(
            cidr_block="0.0.0.0/0",
            gateway_id=igw.id,
        )
    ],
    tags={
        "Name": f"{app_name}-public-rt",
    },
)

# Associate route table with public subnets
public_subnet_a_rt_assoc = aws.ec2.RouteTableAssociation(
    f"{app_name}-public-subnet-a-rt-assoc",
    subnet_id=public_subnet_a.id,
    route_table_id=public_rt.id,
)

public_subnet_b_rt_assoc = aws.ec2.RouteTableAssociation(
    f"{app_name}-public-subnet-b-rt-assoc",
    subnet_id=public_subnet_b.id,
    route_table_id=public_rt.id,
)

# Security group for EC2 instance
backend_sg = aws.ec2.SecurityGroup(
    f"{app_name}-backend-sg",
    vpc_id=vpc.id,
    description="Security group for backend server",
    ingress=[
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=22,
            to_port=22,
            cidr_blocks=["0.0.0.0/0"],  # For SSH access
        ),
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=8000,
            to_port=8000,
            cidr_blocks=["0.0.0.0/0"],  # For API access
        ),
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=80,
            to_port=80,
            cidr_blocks=["0.0.0.0/0"],  # For HTTP access
        ),
    ],
    egress=[
        aws.ec2.SecurityGroupEgressArgs(
            protocol="-1",
            from_port=0,
            to_port=0,
            cidr_blocks=["0.0.0.0/0"],
        ),
    ],
    tags={
        "Name": f"{app_name}-backend-sg",
    },
)

# Create IAM role for EC2 instance (to connect to RDS or other services)
instance_role = aws.iam.Role(
    f"{app_name}-instance-role",
    assume_role_policy=json.dumps(
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "sts:AssumeRole",
                    "Principal": {"Service": "ec2.amazonaws.com"},
                    "Effect": "Allow",
                    "Sid": "",
                }
            ],
        }
    ),
)

# Create IAM instance profile
instance_profile = aws.iam.InstanceProfile(f"{app_name}-instance-profile", role=instance_role.name)

# Create the user data using Pulumi outputs so that secrets are properly resolved.
# Use dictionary keys to access values.
user_data = pulumi.Output.all(
    db_host=config.require("db_host"),
    db_name=config.require("db_name"),
    db_user=config.require_secret("db_user"),
    db_password=config.require_secret("db_password"),
).apply(
    lambda args: f"""#!/bin/bash
apt-get update
apt-get install -y python3 python3-pip git
pip3 install poetry
git clone https://github.com/c0d1ng-4/coding-challenge.git /app
cd /app/backend
poetry install
cd /app
cat > /app/backend/.env << EOL
DB_HOST={args["db_host"]}
DB_PORT=5432
DB_NAME={args["db_name"]}
DB_USER={args["db_user"]}
DB_PASSWORD={args["db_password"]}
EOL
cd /app/backend
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
"""
)

# Get the latest Ubuntu 22.04 LTS AMI from SSM Parameter Store
ubuntu_ami = aws.ssm.get_parameter(
    name="/aws/service/canonical/ubuntu/server/22.04/stable/current/amd64/hvm/ebs-gp2/ami-id",
    with_decryption=True,
)

# Create EC2 instance (t3.micro is available in eu-north-1)
backend_instance = aws.ec2.Instance(
    f"{app_name}-backend-instance",
    instance_type="t3.micro",  # t2.micro is not available in eu-north-1
    ami=ubuntu_ami.value,
    vpc_security_group_ids=[backend_sg.id],
    subnet_id=public_subnet_a.id,
    associate_public_ip_address=True,
    iam_instance_profile=instance_profile.name,
    user_data=user_data,
    tags={
        "Name": f"{app_name}-backend-instance",
    },
)

# Export outputs
pulumi.export("backend_url", pulumi.Output.concat("http://", backend_instance.public_dns, ":8000"))
pulumi.export("backend_ip", backend_instance.public_ip)
