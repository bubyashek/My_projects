#pragma once
#include "AbilityFactory.h"
#include "DoubleDamage.h"

class DoubleDamageFactory : public AbilityFactory
{
public:
    Ability *make(AbilityInfoHolder *abilityInfoHolder) override;
    std::string name() override;
};
