#ifndef GAMESTATE_H
#define GAMESTATE_H

#include "../players/Bot.h"
#include "../players/User.h"
#include "../libs/json.hpp"
#include "../serialization/FileWrapper.h"
#include "../serialization/Serialization.h"
#include "../serialization/Deserialization.h"
#include "../Orientation.h"
#include <sstream>

class Bot;
class User;

class GameState
{
	Bot &bot;
	User &user;

public:
	GameState(User &user, Bot &bot) : user(user), bot(bot) {};
	Bot &getBot();
	User &getUser();
	int &getRounds();
	int &getMoves();
	std::string hash(std::string data);
	void setBot(Bot &bot);
	void setUser(User &user);
	void setMoves(int &moves);
	void setRounds(int &rounds);
	void setGameComponents(std::unique_ptr<Bot> newBot, std::unique_ptr<User> newUser);
	friend std::ostream &operator<<(std::ostream &os, GameState &game);
	friend FileWrapper &operator<<(FileWrapper &fileWrapper, GameState &state);
	GameState &load(const std::string fileName);
	void save(const std::string fileName);
};

#endif