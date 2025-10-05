#pragma once
#include "../BattleShipManager.h"
#include "../BattleField.h"
#include "../abilities/AbilityManager.h"

#include "../libs/json.hpp"
#include <string.h>

class Serialization
{
private:
    nlohmann::json &j;

public:
    Serialization(nlohmann::json &j) : j(j) {};

    void stringify(BattleShipManager &battleShipManager, std::string key);
    void stringify(BattleField &battleField, std::string key);
    void stringify(AbilityManager &abilityManager, std::string key);
};