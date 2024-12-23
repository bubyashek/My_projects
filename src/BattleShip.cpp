#include "BattleShip.h"

BattleShip::BattleShip(unsigned length)
{
    for (int i = 0; i < length; i++)
        segments.push_back(BattleShipSegment(this));
}

unsigned BattleShip::size() { return segments.size(); }

void BattleShip::setPosition(Position pos)
{
    position = pos;
}

bool BattleShip::dead()
{
    for (int i = 0; i < segments.size(); i++)
    {
        if (segments[i].getState() != Broken)
            return false;
    }
    return true;
}

BattleShipSegment &BattleShip::operator[](unsigned index)
{
    return segments[index];
}

Position BattleShip::getPosition()
{
    return position;
}

void BattleShip::setOrientation(Orientation orientation)
{
    this->orientation = orientation;
}

Orientation BattleShip::getOrientation()
{
    return orientation;
}
