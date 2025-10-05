#include "BombardmentFactory.h"

Ability *BombardmentFactory::make(AbilityInfoHolder *abilityInfoHolder)
{
    return new Bombardment(abilityInfoHolder->getBattleShipManager());
}

std::string BombardmentFactory::name()
{
    return "Bombardment";
}
