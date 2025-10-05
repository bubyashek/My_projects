#pragma once
#include "BattleFieldCell.h"
#include "utils.h"
#include "BattleShip.h"
#include "exceptions/PositionInvalid.h"
#include "exceptions/ShipNearPosition.h"
#include <vector>
#include <ostream>
#include "Orientation.h"

class BattleField
{
    friend std::ostream &operator<<(std::ostream &os, BattleField &battleField);

private:
    std::vector<std::vector<BattleFieldCell>> battleField;
    unsigned width;
    unsigned height;
    bool doubleDamageFlag;

public:
    BattleField() : width(0), height(0) {};
    BattleField(unsigned width, unsigned height);
    BattleField(const BattleField &other);
    BattleField(BattleField &&other) noexcept;

    BattleField &operator=(const BattleField &other);
    BattleField &operator=(BattleField &&other) noexcept;

    ~BattleField() = default;

    unsigned getWidth();
    unsigned getHeight();
    bool isPositionValid(Position position);
    BattleFieldCell &at(Position position);
    bool hitCell(Position position, int damage = 1);
    bool placeBattleShip(Position position, BattleShip &battleShip, Orientations orientation);

    void setDoubleDamageFlag(bool value);
};
