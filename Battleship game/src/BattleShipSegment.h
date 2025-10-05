#pragma once
#include <iostream>
#include "BattleShip.h"

enum BattleShipSegmentState
{
    Broken,
    Damaged,
    Undamaged,
};

class BattleShip;

class BattleShipSegment
{
private:
    BattleShipSegmentState state;
    BattleShip *battleShip;

public:
    BattleShipSegment(BattleShip *battleShip);
    BattleShipSegmentState getState();
    void setState(BattleShipSegmentState state);
    bool getHit(int damage);
};
