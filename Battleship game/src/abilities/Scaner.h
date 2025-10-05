#pragma once
#include "Ability.h"
#include "../BattleField.h"
#include "../utils.h"

class Scaner : public Ability
{
    BattleField *battleField;
    Position position;

public:
    Scaner(BattleField &battleField, Position position);
    bool use() override;
};
