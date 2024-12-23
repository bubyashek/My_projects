#ifndef PLAYER_H
#define PLAYER_H

#include <iostream>
#include "../BattleField.h"
#include "../BattleShipManager.h"
#include "Action.h"

class Player
{

public:
	virtual Actions move(Player &player) = 0;
	virtual void placeShips() = 0;
	~Player() = default;
	virtual BattleField &getField() = 0;
	virtual BattleShipManager &getShipManager() = 0;
};

#endif