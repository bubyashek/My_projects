#pragma once
#include "infoHolder.h"
#include "../BattleField.h"
#include "../BattleShipManager.h"
#include "../utils.h"
#include <optional>

class BattleField;
class BattleShipManager;

class AbilityInfoHolder : public InfoHolder
{
    BattleShipManager *battleShipManager;
    BattleField *battleField;
    Position position;

public:
    AbilityInfoHolder(std::optional<BattleShipManager *> battleShipManager = std::nullopt, std::optional<BattleField *> battleField = std::nullopt, std::optional<Position *> position = std::nullopt);
    ~AbilityInfoHolder();
    BattleShipManager &getBattleShipManager();
    BattleField &getBattleField();
    Position &getPosition();
    void setBattleShipManager(BattleShipManager &battleShipManager);
    void setBattleField(BattleField &battleField);
    void setPosition(Position position);
};
