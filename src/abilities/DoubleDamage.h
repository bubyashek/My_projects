#pragma once
#include "Ability.h"
#include "../BattleField.h"

class DoubleDamage : public Ability
{
    BattleField *battleField;

public:
    DoubleDamage(BattleField &battleField);
    bool use() override;
};
