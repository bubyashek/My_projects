#include "Deserialization.h"

void Deserialization::parse(BattleShipManager &battleShipManager, std::string key)
{
    const auto &jsm = j.at(key);
    std::vector<unsigned> shipLengths;

    for (const auto &jship : jsm)
    {
        auto length = jship.at("length");
        shipLengths.push_back(length);
    }
    battleShipManager = BattleShipManager(shipLengths);

    for (size_t i = 0; i < battleShipManager.getNumberOfBattleShips(); i++)
    {
        std::string key = "ship_" + std::to_string(i);
        BattleShip &ship = battleShipManager[i];
        auto segments = jsm.at(key).at("cells");
        auto x = jsm.at(key).at("x");
        auto y = jsm.at(key).at("y");
        auto direction = jsm.at(key).at("direction");
        ship.setPosition({x, y});
        ship.setOrientation(Orientations(direction));
        int j = 0;
        for (auto it = segments.begin(); it != segments.end(); it++)
        {
            // std::cout << "key " << key << ship[j].getState() << '\n';
            auto segmentJson = it.value();
            BattleShipSegmentState shipCellState = segmentJson.at("state");
            ship[j].setState(shipCellState);
            j++;
        }
    }
}

void Deserialization::parse(BattleField &battleField, std::string key)
{
    const auto &JSON = j.at(key);
    battleField = BattleField(JSON.at("width"), JSON.at("height"));

    for (int y = 0; y < battleField.getHeight(); y++)
    {
        for (int x = 0; x < battleField.getWidth(); x++)
        {
            std::string key = "cell_" + std::to_string(x) + "_" + std::to_string(y);
            BattleFieldCell &cell = battleField.at({x, y});
            cell.setState(BattleFieldCellState(JSON.at(key).at("state")));
        }
    }
    std::cout << "ended for battleField\n";
}

void Deserialization::parse(AbilityManager &abilityManager, std::string key)
{
    const auto &jam = j.at(key);
    abilityManager = AbilityManager();
    abilityManager.pop_all();
    if (jam == nullptr)
        return;
    for (const auto &jability : jam.at("skills"))
    {
        if (jability == "DoubleDamage")
        {
            abilityManager.add(new DoubleDamageFactory());
        }
        else if (jability == "Scaner")
        {
            abilityManager.add(new ScanerFactory());
        }
        else if (jability == "Bombardment")
        {
            abilityManager.add(new BombardmentFactory());
        }
    }
}