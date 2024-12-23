#include "DoubleDamageFactory.h"

Ability *DoubleDamageFactory::make(AbilityInfoHolder *abilityInfoHolder)
{
    return new DoubleDamage(abilityInfoHolder->getBattleField());
}

std::string DoubleDamageFactory::name()
{
    return "DoubleDamage";
}
