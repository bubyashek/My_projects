#ifndef GAME_H
#define GAME_H
// #pragma once

#include "../BattleField.h"
#include "../BattleShipManager.h"
#include "../abilities/AbilityManager.h"
#include "GameState.h"
#include "../players/Bot.h"
#include "../players/User.h"
#include <fstream>

class GameState;
class Game
{
public:
	virtual GameState getGameState() = 0;
	virtual void load(std::string fileName) = 0;
	virtual void save(std::string fileName) = 0;
	virtual void start(std::string filename) = 0;
};

#endif