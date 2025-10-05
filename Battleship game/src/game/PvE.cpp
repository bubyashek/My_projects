#include "PvE.h"

void PvE::start(std::string filename)
{
	std::cout << this->user.getDamage();
	while (!this->user.getShipManager().lost())
	{
		std::cout << moveCount << " move\n";
		auto state = this->getGameState();
		std::cout << state;
		if (moveCount % 2)
		{
			this->currentPlayer = &user;
			this->currentEnemy = &bot;
		}
		else
		{
			this->currentPlayer = &bot;
			this->currentEnemy = &user;
		}

		try
		{
			auto action = this->currentPlayer->move(*(this->currentEnemy));
			if (action == Actions::SaveGame)
			{
				this->save(filename);
				continue;
			}
			if (action == Actions::LoadGame)
			{
				this->load(filename);
				auto state = this->getGameState();
				std::cout << state;
				std::cout << "Игра загружена из сохранения.\n";
				continue;
			}
		}
		catch (std::exception &error)
		{
			moveCount--;
			std::cout << error.what();
		}

		if (this->bot.getShipManager().lost())
		{
			auto field = this->bot.getField();
			auto shipManager = this->bot.getShipManager();

			std::vector<unsigned> shipLengths;
			for (int i = 0; i < shipManager.getNumberOfBattleShips(); i++)
			{
				shipLengths.push_back(shipManager[i].size());
			}

			this->bot = Bot(field.getWidth(), field.getHeight(), shipLengths);
			this->state.setBot(this->bot);
			this->bot.placeShips();
		}

		moveCount++;
	}
	std::cout << "Вы проиграли...\n";
}

GameState PvE::getGameState()
{
	return this->state;
}

void PvE::load(std::string filename)
{
	auto state = this->getGameState();
	try
	{
		state.load(filename);
	}
	catch (nlohmann::json::exception &e)
	{
		std::cerr << "Error parsing JSON: " << e.what() << std::endl;
		return;
	}
}

void PvE::save(std::string filename)
{
	auto state = this->getGameState();
	state.save(filename);
	std::cout << "Игра сохранена.\n";
}
