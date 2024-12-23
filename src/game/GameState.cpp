#include "GameState.h"

std::string GameState::hash(std::string data)
{
	std::hash<std::string> hash_function;
	size_t hash = hash_function(data);
	std::stringstream ss;
	ss << std::hex << hash;
	return ss.str();
}

Bot &GameState::getBot()
{
	return this->bot;
}

User &GameState::getUser()
{
	return this->user;
}

std::ostream &operator<<(std::ostream &os, GameState &state)
{
	auto userField = state.getUser().getField();
	auto botField = state.getBot().getField();

	os << "Player field\n";
	os << userField << '\n';
	os << "Bot field:\n";
	os << botField << '\n';

	os << "Your abilities:\n";
	auto abilityManager = state.getUser().getAbilityManager();
	std::cout << "Number of available abilities: " << abilityManager.size() << '\n';
	if (abilityManager.size() == 0)
	{
		os << "None.\n";
	}
	for (int i = 0; i < abilityManager.size(); i++)
	{
		auto name = abilityManager[i].name();
		os << i + 1 << ". " << name << '\n';
	}
	return os;
}

FileWrapper &operator<<(FileWrapper &fileWrapper, GameState &state)
{
	nlohmann::json j;
	nlohmann::json data;
	Serialization serialization(data);

	serialization.stringify(state.getUser().getShipManager(), "playerShipManager");
	serialization.stringify(state.getUser().getField(), "playerField");
	serialization.stringify(state.getUser().getAbilityManager(), "playerSkillManager");
	serialization.stringify(state.getBot().getShipManager(), "botShipManager");
	serialization.stringify(state.getBot().getField(), "botField");

	data["currentDamage"] = state.getUser().getDamage();
	j["data"] = data;
	std::string jsonData = data.dump();
	j["hash"] = state.hash(jsonData);

	try
	{
		fileWrapper.write(j);
	}
	catch (std::exception &e)
	{
		std::cerr << e.what() << std::endl;
	}

	return fileWrapper;
}

void placeShips(BattleShipManager &battleShipManager, BattleField &battleField)
{
	std::cout << battleShipManager.getNumberOfBattleShips() << " battleships\n";
	for (int i = 0; i < battleShipManager.getNumberOfBattleShips(); i++)
	{
		std::cout << i << " i\n";
		auto &ship = battleShipManager[i];
		Position position = ship.getPosition();
		Orientation orientation = ship.getOrientation();

		std::cout << "x " << position.x << " y " << position.y << " d " << orientation.get() << "\n"
				  << battleField << '\n';
		battleField.placeBattleShip(position, ship, orientation.get());
	}
}

FileWrapper &operator>>(FileWrapper &fileWrapper, GameState &state)
{
	nlohmann::json j;

	try
	{
		fileWrapper.read(j);
	}
	catch (std::exception &e)
	{
		std::cerr << e.what() << std::endl;
		return fileWrapper;
	}
	auto data = j["data"];
	std::string jsonHash = j["hash"];

	std::string jsonData = data.dump();
	std::string currentHash = state.hash(jsonData);
	if (jsonHash != currentHash)
	{
		std::cout << jsonHash << " " << currentHash << "\n";
		throw std::runtime_error("JSON был модифицирован.");
	}

	Deserialization deserialization(data);

	BattleShipManager battleShipManager;
	BattleField battleField;
	AbilityManager abilityManager;

	BattleShipManager botShipManager;
	BattleField botField;

	deserialization.parse(battleShipManager, "playerShipManager");
	deserialization.parse(battleField, "playerField");

	deserialization.parse(abilityManager, "playerSkillManager");
	placeShips(battleShipManager, battleField);

	deserialization.parse(botShipManager, "botShipManager");
	deserialization.parse(botField, "botField");
	placeShips(botShipManager, botField);

	// std::cout << field.GetWidth() << " " << field.GetHeight() << "width and height of loaded field\n";
	state.getUser().setShipManager(battleShipManager);
	state.getUser().setAbilityManager(abilityManager);
	state.getUser().setField(battleField);

	state.getBot().setShipManager(botShipManager);
	state.getBot()
		.setField(botField);

	return fileWrapper;
}

void GameState::save(const std::string fileName)
{
	FileWrapper wrapper(fileName);
	wrapper << *this;
}

GameState &GameState::load(const std::string fileName)
{
	FileWrapper fileWrapper(fileName);
	fileWrapper >> *this;
	return *this;
}

void GameState::setBot(Bot &bot)
{
	this->bot = bot;
}

void GameState::setUser(User &user)
{
	this->user = user;
}
