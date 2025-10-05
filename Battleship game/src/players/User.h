#ifndef USER_H
#define USER_H

#include "Player.h"
#include "../abilities/AbilityManager.h"
#include "../utils.h"
#include "../exceptions/ShipNearPosition.h"
#include <iostream>

class User : public Player
{
private:
	BattleField battleField;
	BattleShipManager battleShipManager;
	AbilityManager abilityManager;
	int damage;

public:
	int getDamage();
	User(int width, int height, std::vector<unsigned> shipLengths);
	User(const User &other)
		: battleShipManager(other.battleShipManager), battleField(other.battleField), abilityManager(other.abilityManager), damage(other.damage) {};
	~User();
	User &operator=(User &other)
	{
		if (this != &other)
		{
			this->battleShipManager = other.battleShipManager;
			this->battleField = other.battleField;
			this->abilityManager = other.abilityManager;
			this->damage = other.damage;
		}
		return *this;
	}
	Actions move(Player &player) override;
	void placeShips() override;

	bool hitCell(Player &player, Position position);
	User();
	BattleField &getField() override;
	BattleShipManager &getShipManager() override;
	AbilityManager &getAbilityManager();
	void setShipManager(BattleShipManager &sm);
	void setField(BattleField &f);
	void setAbilityManager(AbilityManager &sm);
};

#endif
