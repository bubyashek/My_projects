#include "Serialization.h"
#include <fstream>

void Serialization::stringify(BattleShipManager &shipManager, std::string key)
{
    nlohmann::json JSON = nlohmann::json{};

    for (int i = 0; i < shipManager.getNumberOfBattleShips(); i++)
    {
        auto &ship = shipManager[i];
        std::string key = "ship_" + std::to_string(i);
        JSON[key] = {
            {"length", ship.size()},
            {"direction", ship.getOrientation().get()},
            {"x", ship.getPosition().x},
            {"y", ship.getPosition().y},
            {"cells", nlohmann::json::array()}};

        for (int j = 0; j < ship.size(); j++)
        {
            auto &shipCell = ship[j];
            JSON[key]["cells"].push_back({{"state", shipCell.getState()}});
        }
    }

    j[key] = JSON;
}

void Serialization::stringify(BattleField &field, std::string key)
{
    nlohmann::json JSON = nlohmann::json{};

    JSON["width"] = field.getWidth();
    JSON["height"] = field.getHeight();

    for (int y = 0; y < field.getHeight(); y++)
    {
        for (int x = 0; x < field.getWidth(); x++)
        {
            std::string key = "cell_" + std::to_string(x) + "_" + std::to_string(y);
            JSON[key] = {{"state", field.at({x, y}).getState()}};
        }
    }
    std::cout << "Поле записано.\n";
    j[key] = JSON;
}

void Serialization::stringify(AbilityManager &abilityManager, std::string key)
{
    nlohmann::json JSON = nlohmann::json{};
    for (int i = 0; i < abilityManager.size(); i++)
    {
        JSON["skills"].push_back(abilityManager[i].name());
    }

    j[key] = JSON;
}