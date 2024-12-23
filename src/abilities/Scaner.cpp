#include "Scaner.h"

Scaner::Scaner(BattleField &battleField, Position position) : battleField(&battleField), position(position) {}

bool Scaner::use()
{
    for (int i = 0; i < 2; i++)
    {
        for (int j = 0; j < 2; j++)
        {
            if (battleField->at({position.x + i, position.y + j}).hasShipSegment())
                return true;
        }
    }

    return false;
}
