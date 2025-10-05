#pragma once
#include "BattleShip.h"
#include "BattleField.h"
#include <vector>

class BattleShipManager
{
private:
    std::vector<BattleShip> battleShips;

public:
    BattleShipManager() {};
    BattleShipManager(std::vector<unsigned> sizes);
    unsigned getNumberOfBattleShips();
    BattleShip &operator[](unsigned index);
    bool lost();
};
