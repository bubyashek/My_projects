#pragma once

#include "../BattleShipManager.h"
#include "../BattleField.h"
#include "../abilities/AbilityManager.h"
#include "../Orientation.h"

#include <string.h>
#include "../libs/json.hpp"

class Deserialization
{
private:
    nlohmann::json &j;

public:
    Deserialization(nlohmann::json &j) : j(j) {};

    void parse(BattleShipManager &battleShipManager, std::string key);
    void parse(BattleField &battleField, std::string key);
    void parse(AbilityManager &abilityManager, std::string key);
};
