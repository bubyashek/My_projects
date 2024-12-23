#pragma once
#include "BattleShipSegment.h"
#include <vector>
#include "Orientation.h"
#include "utils.h"

class BattleShipSegment;

class BattleShip
{
private:
    Position position;
    Orientation orientation;
    std::vector<BattleShipSegment> segments;

public:
    BattleShip(unsigned size);
    unsigned size();
    bool dead();
    BattleShipSegment &operator[](unsigned index);
    void setPosition(Position pos);
    Position getPosition();
    void setOrientation(Orientation orientation);
    Orientation getOrientation();
};
