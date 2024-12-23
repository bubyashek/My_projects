#include "User.h"
#include <limits>

User::User(int width, int height, std::vector<unsigned> shipLengths) : battleField(width, height), battleShipManager(shipLengths)
{
	this->abilityManager = AbilityManager();
	this->damage = 1;
	placeShips();
}

User::User() : battleField(), battleShipManager() {}
User::~User() {}

Actions User::move(Player &player)
{
	Action userInput;
	std::cin >> userInput;

	try
	{
		if (userInput.get() == Actions::Attack)
		{

			Position position;
			std::cout << "Enter coordinates:\n";
			std::cin >> position;

			hitCell(player, position);
		}
		else if (userInput.get() == Actions::UseSkill)
		{
			auto abilityInfoHolder = AbilityInfoHolder(&player.getShipManager(), &player.getField());
			try
			{
				Position position;
				std::string name = abilityManager[0].name();
				if (name == "Scaner")
				{
					std::cout << "Введите координаты для проверки сканером:\n";
					std::cin >> position;
					abilityInfoHolder.setPosition(position);
				}

				if (std::cin.fail())
				{
					std::cin.clear();
					std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
					throw std::runtime_error("Введены некорректные данные для размеров поля.");
				}

				auto skill = abilityManager.nextAbility(abilityInfoHolder);

				bool res = skill->use();
				if (name == "Scaner")
				{
					std::cout << (res ? "Корабль есть" : "Кораблей нет") << '\n';
				}
				else if (name == "Shelling")
				{
					abilityManager.giveNewAbility(res);
				}

				delete skill;
			}
			catch (const std::exception &e)
			{
				std::cerr << e.what() << '\n';
			}
		}
		else
		{
			return userInput.get();
		}
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << '\n';
	}

	return Actions::Attack;
}

bool User::hitCell(Player &player, Position position)
{
	bool result = player.getField().hitCell(position, damage);
	this->abilityManager.giveNewAbility(result);
	return result;
}

void User::placeShips()
{
	int numOfShips = battleShipManager.getNumberOfBattleShips();
	for (int i = 0; i < numOfShips;)
	{
		Position position;
		Orientation orientation;
		try
		{
			std::cout << "Enter coordinates:\n";
			std::cin >> position;
			// std::cout << "coords: (" << position.x << ", " << position.y << ")\n";

			std::cin >> orientation;

			auto &ship = battleShipManager[i];
			this->battleField.placeBattleShip(position, ship, orientation.get());
			std::cout << battleField << '\n';

			i++;
		}
		catch (std::exception &e)
		{
			std::cout << e.what() << "\n";
		}
	}
}

BattleField &User::getField()
{
	return this->battleField;
}

BattleShipManager &User::getShipManager()
{
	return this->battleShipManager;
}

AbilityManager &User::getAbilityManager()
{
	return this->abilityManager;
}

int User::getDamage()
{
	return this->damage;
}

void User::setShipManager(BattleShipManager &sm)
{
	this->battleShipManager = sm;
}

void User::setField(BattleField &field)
{
	this->battleField = field;
}

void User::setAbilityManager(AbilityManager &abilityManager)
{
	this->abilityManager = abilityManager;
}
