#include "AbilityInfoHolder.h"

AbilityInfoHolder::AbilityInfoHolder(std::optional<BattleShipManager *> battleShipManager, std::optional<BattleField *> battleField, std::optional<Position *> position)
{
    if (battleField == std::nullopt)
        this->battleField = nullptr;
    else
        this->battleField = battleField.value();

    if (battleShipManager == std::nullopt)
        this->battleShipManager = nullptr;
    else
        this->battleShipManager = battleShipManager.value();

    if (position == std::nullopt)
        this->position = Position();
    else
        this->position = *position.value();
}

BattleField &AbilityInfoHolder::getBattleField()
{
    return *(this->battleField);
}

BattleShipManager &AbilityInfoHolder::getBattleShipManager()
{
    return *(this->battleShipManager);
}

Position &AbilityInfoHolder::getPosition()
{
    return this->position;
}

void AbilityInfoHolder::setBattleShipManager(BattleShipManager &battleShipManager)
{
    this->battleShipManager = &battleShipManager;
}

void AbilityInfoHolder::setBattleField(BattleField &battleField)
{
    this->battleField = &battleField;
}

void AbilityInfoHolder::setPosition(Position position)
{
    this->position = position;
}

AbilityInfoHolder::~AbilityInfoHolder() {}
