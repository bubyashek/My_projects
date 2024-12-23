#pragma once
#include "AbilityFactory.h"
#include "Bombardment.h"

class BombardmentFactory : public AbilityFactory
{
public:
    Ability *make(AbilityInfoHolder *abilityInfoHolder) override;
    std::string name() override;
};
