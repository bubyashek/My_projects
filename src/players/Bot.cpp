#include "Bot.h"

Bot::Bot(int width, int height, std::vector<unsigned> shipLengths) : battleField(width, height), battleShipManager(shipLengths), damage(1)
{
	placeShips();
}
Bot::Bot() : battleField(1, 1), battleShipManager({1}) {}
Bot::~Bot() {}

void Bot::placeShips()
{
	std::vector<Orientations> dirs = {Orientations::Left, Orientations::Up, Orientations::Right, Orientations::Down};
	int numOfShips = battleShipManager.getNumberOfBattleShips();
	int count = 0;
	for (int i = 0; i < numOfShips;)
	{
		count++;
		if (count > 1000)
		{
			std::cout << "Too small" << "\n";
			break;
		}

		Position position;
		Orientation orientation;
		try
		{
			int x = randomInt(0, battleField.getWidth() - 1);
			int y = randomInt(0, battleField.getWidth() - 1);
			int dir = randomInt(0, dirs.size() - 1);
			Orientations orientations = dirs[dir];

			auto &ship = battleShipManager[i];
			this->battleField.placeBattleShip({x, y}, ship, orientations);
			std::cout << battleField << '\n';

			i++;
		}
		catch (std::exception &e)
		{
			// std::cout << e.what() << "\n";
		}
	}
}

Actions Bot::move(Player &player)
{
	try
	{
		int x = randomInt(0, battleField.getWidth() - 1);
		int y = randomInt(0, battleField.getWidth() - 1);

		player.getField().hitCell({x, y}, damage);
		std::cout << battleField << '\n';
	}
	catch (std::exception &e)
	{
		// std::cout << e.what() << "\n";
	}

	return Actions::Attack;
}

BattleField &Bot::getField()
{
	return this->battleField;
}

BattleShipManager &Bot::getShipManager()
{
	return this->battleShipManager;
}

void Bot::setShipManager(BattleShipManager &sm)
{
	this->battleShipManager = sm;
}

void Bot::setField(BattleField &f)
{
	this->battleField = f;
}
