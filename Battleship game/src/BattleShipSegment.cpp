#include "BattleShipSegment.h"

BattleShipSegment::BattleShipSegment(BattleShip *battleShip) : battleShip(battleShip), state(BattleShipSegmentState::Undamaged) {};

BattleShipSegmentState BattleShipSegment::getState() { return state; }

void BattleShipSegment::setState(BattleShipSegmentState state) { this->state = state; }

bool BattleShipSegment::getHit(int damage)
{
    if (damage <= 0)
        return false;

    if (battleShip->dead())
        return false;

    if (state == BattleShipSegmentState::Undamaged)
        state = damage == 1 ? BattleShipSegmentState::Damaged : BattleShipSegmentState::Broken;
    else
        state = BattleShipSegmentState::Broken;

    return battleShip->dead();
}
