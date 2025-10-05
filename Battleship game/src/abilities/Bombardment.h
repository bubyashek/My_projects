#pragma once
#include "Ability.h"
#include "../BattleShipManager.h"

class Bombardment : public Ability
{
    BattleShipManager *battleShipManager;

public:
    Bombardment(BattleShipManager &battleShipManager);
    bool use() override;
};
