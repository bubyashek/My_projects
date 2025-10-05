#pragma once
#include "Ability.h"
#include "../infoHolders/AbilityInfoHolder.h"

class AbilityFactory
{
public:
    virtual Ability *make(AbilityInfoHolder *abilityInfoHolder) = 0;
    virtual std::string name() = 0;
};
