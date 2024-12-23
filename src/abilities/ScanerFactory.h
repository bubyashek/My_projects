#pragma once
#include "AbilityFactory.h"
#include "Scaner.h"

class ScanerFactory : public AbilityFactory
{
public:
    Ability *make(AbilityInfoHolder *abilityInfoHolder) override;
    std::string name() override;
};
