#include <iostream>
#include <vector>
#include <limits>
#include "BattleField.h"
#include "BattleShipManager.h"
#include "utils.h"
#include "abilities/AbilityManager.h"
#include "exceptions/NoAbilitiesAvailable.h"
#include "exceptions/ShipNearPosition.h"
#include "exceptions/PositionInvalid.h"
#include "infoHolders/AbilityInfoHolder.h"
#include "players/User.h"
#include "players/Bot.h"
#include "game/PvE.h"

int main()
{
    try
    {
        Position position;
        std::cout << "Enter width and height:\n";
        std::cin >> position;

        if (std::cin.fail())
        {
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            throw std::runtime_error("Field width and height invalid.");
        }

        if (position.x < 1 || position.y < 1)
            throw std::runtime_error("Field too small.");

        int numOfShips = 0;
        std::cout << "Enter number of ships to place:\n";
        std::cin >> numOfShips;

        if (std::cin.fail())
        {
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            throw std::runtime_error("Введены некорректные данные для количества кораблей.");
        }

        if (numOfShips < 1)
            throw std::runtime_error("Минимальное количество кораблей: 1");

        std::vector<unsigned> shipLengths;
        for (int i = 0; i < numOfShips;)
        {
            try
            {
                int length = 0;
                std::cout << "Введите длину для " << i + 1 << "-го корабля\n";
                std::cin >> length;

                if (std::cin.fail())
                {
                    std::cin.clear();
                    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
                    throw std::runtime_error("Введены некорректные данные для длины корабля.");
                }

                if (length < 1)
                    throw std::runtime_error("Минимальное длина корабля: 1");

                shipLengths.push_back(length);
                i++;
            }
            catch (const std::exception &e)
            {
                std::cerr << e.what() << '\n';
            }
        }

        auto bot = Bot(position.x, position.y, shipLengths);
        auto user = User(position.x, position.y, shipLengths);

        auto state = GameState(user, bot);
        Game *game = new PvE(user, bot, state);
        game->start("/home/bubyashek/yulecka_bubyakina/save.json");
    }
    catch (std::exception &e)
    {
        std::cout << e.what() << '\n';
        std::cout << "Пожалуйста, попробуйте снова, кажется, вы ввели некорректные данные.\n";
    }
}