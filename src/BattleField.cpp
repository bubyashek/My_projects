#include "BattleField.h"
#include "utils.h"

BattleField::BattleField(unsigned width, unsigned height) : width(width), height(height), doubleDamageFlag(false)
{
    for (unsigned i = 0; i < height; i++)
    {
        battleField.push_back(std::vector<BattleFieldCell>(width));
    }
}

bool BattleField::isPositionValid(Position position)
{
    if (position.y < 0 || position.y >= height || position.x < 0 || position.x >= width)
        throw PositionInvalid();

    return true;
}

BattleFieldCell &BattleField::at(Position position)
{
    isPositionValid(position);
    return battleField[position.y][position.x];
}

BattleField::BattleField(const BattleField &other) : width(other.width), height(other.height), doubleDamageFlag(other.doubleDamageFlag)
{
    battleField = other.battleField;
}

BattleField &BattleField::operator=(const BattleField &other)
{
    if (this != &other)
    {
        width = other.width;
        height = other.height;
        doubleDamageFlag = other.doubleDamageFlag;
        battleField = other.battleField;
    }
    return *this;
}

BattleField &BattleField::operator=(BattleField &&other) noexcept
{
    if (this != &other)
    {
        width = other.width;
        height = other.height;
        doubleDamageFlag = other.doubleDamageFlag;
        battleField = std::move(other.battleField);
    }
    return *this;
}

bool BattleField::hitCell(Position position, int damage)
{
    isPositionValid(position);
    if (doubleDamageFlag)
    {
        damage = 2;
        doubleDamageFlag = false;
    }
    return battleField[position.y][position.x].hitCell(damage);
}

void BattleField::setDoubleDamageFlag(bool value)
{
    doubleDamageFlag = value;
}

bool BattleField::placeBattleShip(Position position, BattleShip &battleShip, Orientations orientation)
{
    int size = battleShip.size();

    Position pos1 = {position.x - 1, position.y - 1};
    Position pos2 = {position.x + 1, position.y + 1};

    switch (orientation)
    {
    case Orientations::Left:
        pos1.x -= size - 1;
        break;

    case Orientations::Up:
        pos1.y -= size - 1;
        break;

    case Orientations::Right:
        pos2.x += size - 1;
        break;

    case Orientations::Down:
        pos2.y += size - 1;
        break;
    }

    for (int i = clamp(pos1.y, 0, height - 1); i <= clamp(pos2.y, 0, height - 1); i++)
    {
        for (int j = clamp(pos1.x, 0, width - 1); j <= clamp(pos2.x, 0, width - 1); j++)
        {
            if (battleField[i][j].hasShipSegment())
            {
                throw ShipNearPosition();
            }
        }
    }

    pos1.x += 1;
    pos1.y += 1;

    pos2.x -= 1;
    pos2.y -= 1;

    isPositionValid(pos1);
    isPositionValid(pos2);

    int shipIndex = 0;
    for (int i = pos1.y; i <= pos2.y; i++)
    {
        for (int j = pos1.x; j <= pos2.x; j++)
        {
            BattleShipSegment &segment = battleShip[shipIndex];
            battleField[i][j].setBattleShipSegment(segment);
            shipIndex++;
        }
    }

    battleShip.setOrientation(orientation);
    battleShip.setPosition(position);

    return true;
}

unsigned BattleField::getHeight()
{
    return height;
}

unsigned BattleField::getWidth()
{
    return width;
}

std::ostream &operator<<(std::ostream &os, BattleField &battleField)
{
    os << "\n";
    for (int i = 0; i < battleField.getHeight(); i++)
    {
        for (int j = 0; j < battleField.getWidth(); j++)
        {
            os << battleField.battleField[i][j] << " ";
        }
        os << "\n";
    }
    os << "\n";
    return os;
}
