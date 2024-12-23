#include "BattleFieldCell.h"

BattleFieldCell::BattleFieldCell() : battleShipSegment(nullptr), state(BattleFieldCellState::Unknown) {}

BattleFieldCellState BattleFieldCell::getState() { return state; };
void BattleFieldCell::setState(BattleFieldCellState state) { this->state = state; };

bool BattleFieldCell::hitCell(int damage)
{
    if (state == BattleFieldCellState::Unknown)
        state = hasShipSegment() ? BattleFieldCellState::Ship : BattleFieldCellState::Empty;

    if (state == BattleFieldCellState::Ship)
        return battleShipSegment->getHit(damage);

    return false;
}

void BattleFieldCell::setBattleShipSegment(BattleShipSegment &battleShipSegment)
{
    this->battleShipSegment = &battleShipSegment;
}

bool BattleFieldCell::hasShipSegment() { return battleShipSegment != nullptr; }

std::ostream &operator<<(std::ostream &os, BattleFieldCell &cell)
{
    os << (cell.state != BattleFieldCellState::Unknown || true ? (cell.hasShipSegment() ? (cell.battleShipSegment->getState() == BattleShipSegmentState::Undamaged ? "O" : (cell.battleShipSegment->getState() == BattleShipSegmentState::Damaged ? "o" : ".")) : "w") : "~");
    return os;
}
