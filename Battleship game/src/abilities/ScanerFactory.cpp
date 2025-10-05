#include "ScanerFactory.h"

Ability *ScanerFactory::make(AbilityInfoHolder *abilityInfoHolder)
{
    auto &battleField = abilityInfoHolder->getBattleField();
    auto &position = abilityInfoHolder->getPosition();
    return new Scaner(battleField, position);
}

std::string ScanerFactory::name()
{
    return "Scaner";
}
