"""update caretype enum for consistent casing

Revision ID: bbec08251bf1
Revises: d4f778958b60
Create Date: 2025-03-07 19:00:25.047386

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "bbec08251bf1"
down_revision: Union[str, None] = "d4f778958b60"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("CREATE TYPE caretype_new AS ENUM ('ambulatory', 'stationary', 'day_care')")

    op.execute(
        """
    ALTER TABLE patients
    ALTER COLUMN care_type TYPE caretype_new
    USING (
        CASE care_type::text
            WHEN 'Ambulatory' THEN 'ambulatory'::caretype_new
            WHEN 'Stationary' THEN 'stationary'::caretype_new
            ELSE care_type::text::caretype_new
        END
    )
    """
    )

    op.execute(
        """
    ALTER TABLE care_types
    ALTER COLUMN name TYPE caretype_new
    USING (
        CASE name::text
            WHEN 'Ambulatory' THEN 'ambulatory'::caretype_new
            WHEN 'Stationary' THEN 'stationary'::caretype_new
            ELSE name::text::caretype_new
        END
    )
    """
    )

    op.execute("DROP TYPE caretype")

    op.execute("ALTER TYPE caretype_new RENAME TO caretype")


def downgrade() -> None:
    pass
