#pragma once

#include <iostream>
#include <optional>
#include <string>
#include <queue>
#include "BombardmentFactory.h"
#include "DoubleDamageFactory.h"
#include "ScanerFactory.h"
#include "Ability.h"
#include "AbilityFactory.h"
#include <ostream>
#include "../infoHolders/AbilityInfoHolder.h"
#include "../exceptions/NoAbilitiesAvailable.h"

class AbilityManager
{
private:
    friend std::ostream &operator<<(std::ostream &os, AbilityManager &abilityManager);

    std::queue<AbilityFactory *> queue;
    std::vector<AbilityFactory *> availableFactories;

public:
    AbilityManager(std::optional<std::vector<AbilityFactory *>> availableFactories = std::nullopt);
    void pushAbilityFactory(AbilityFactory *);
    void giveNewAbility(bool shipDied);
    Ability *nextAbility(AbilityInfoHolder &abilityInfoHolder);
    int size();

    void pop_all();
    void add(AbilityFactory *abilityFactory);
    AbilityFactory &operator[](int index);
};
