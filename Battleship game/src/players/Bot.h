#ifndef BOT_H
#define BOT_H

#include "Player.h"
#include "../game/Game.h"
#include "../utils.h"

class Bot : public Player
{
private:
	BattleField battleField;
	BattleShipManager battleShipManager;
	std::vector<std::pair<int, int>> availableMoves;
	int damage;

public:
	Bot(int width, int height, std::vector<unsigned> shipLengths);
	Bot(const Bot &other) : battleField(other.battleField), battleShipManager(other.battleShipManager), damage(other.damage) {};
	Bot &operator=(const Bot &other)
	{
		if (this != &other)
		{
			this->battleField = other.battleField;
			this->battleShipManager = other.battleShipManager;
			this->damage = other.damage;
		}
		return *this;
	}
	Bot();
	~Bot();
	Actions move(Player &player) override;
	BattleField &getField() override;
	void placeShips() override;
	void setField(BattleField &f);
	void setShipManager(BattleShipManager &sm);
	BattleShipManager &getShipManager() override;
};

#endif
