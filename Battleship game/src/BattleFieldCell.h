#pragma once
#include "BattleShipSegment.h"
#include <ostream>

enum class BattleFieldCellState
{
    Unknown,
    Empty,
    Ship,
};

class BattleFieldCell
{
    friend std::ostream &operator<<(std::ostream &os, BattleFieldCell &cell);

private:
    BattleFieldCellState state;
    BattleShipSegment *battleShipSegment;

public:
    BattleFieldCell();
    void setState(BattleFieldCellState state);
    BattleFieldCellState getState();
    void setBattleShipSegment(BattleShipSegment &);
    bool hasShipSegment();
    bool hitCell(int damage);
};
