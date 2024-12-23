#include "BattleShipManager.h"

BattleShipManager::BattleShipManager(std::vector<unsigned> sizes)
{
    for (int i = 0; i < sizes.size(); i++)
    {
        unsigned size = sizes[i];
        BattleShip battleShip(size);
        battleShips.push_back(battleShip);
    }
}

BattleShip &BattleShipManager::operator[](unsigned index) { return battleShips[index]; }

unsigned BattleShipManager::getNumberOfBattleShips() { return battleShips.size(); }

bool BattleShipManager::lost()
{
    for (int i = 0; i < battleShips.size(); i++)
    {
        if (!battleShips.at(i).dead())
            return false;
    }
    return true;
}