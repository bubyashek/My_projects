#include "Bombardment.h"

Bombardment::Bombardment(BattleShipManager &battleShipManager) : battleShipManager(&battleShipManager) {}

bool Bombardment::use()
{
    std::vector<BattleShipSegment *> segments;
    for (int i = 0; i < battleShipManager->getNumberOfBattleShips(); i++)
    {
        auto &ship = (*battleShipManager)[i];
        if (ship.dead())
            continue;

        for (int j = 0; j < ship.size(); j++)
            segments.push_back(&ship[j]);
    }

    while (segments.size())
    {
        int index = (std::rand() % segments.size());

        if (segments[index]->getState() != Broken)
            return segments[index]->getHit(1);
    }

    return false;
}
