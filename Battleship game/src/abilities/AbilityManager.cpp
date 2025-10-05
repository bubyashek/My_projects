#include "AbilityManager.h"

std::ostream &operator<<(std::ostream &os, AbilityManager &abilityManager)
{
    auto temp = abilityManager.queue;

    if (temp.empty())
        os << "No abilities available." << "\n";

    while (!temp.empty())
    {
        auto elem = temp.front();
        os << elem->name() << "\n";
        temp.pop();
    }

    return os;
}

AbilityManager::AbilityManager(std::optional<std::vector<AbilityFactory *>> factories)
{
    this->queue = std::queue<AbilityFactory *>();
    this->availableFactories = factories.value_or(std::vector<AbilityFactory *>{new ScanerFactory, new BombardmentFactory, new DoubleDamageFactory});
    auto factoriesCopy(this->availableFactories);
    while (factoriesCopy.size())
    {
        int index = std::rand() % factoriesCopy.size();
        this->queue.push(factoriesCopy[index]);
        factoriesCopy.erase(factoriesCopy.begin() + index);
    }
}

Ability *AbilityManager::nextAbility(AbilityInfoHolder &abilityInfoHolder)
{
    if (this->availableFactories.empty() || this->queue.empty())
        throw NoAbilitiesAvailable();

    auto abilityFactory = this->queue.front();
    std::cout << "Current ability: " << abilityFactory->name() << '\n';
    this->queue.pop();
    return abilityFactory->make(&abilityInfoHolder);
}

void AbilityManager::giveNewAbility(bool shipDied)
{
    if (this->availableFactories.empty())
        throw NoAbilitiesAvailable();

    if (!shipDied)
        return;

    this->queue.push(availableFactories[std::rand() % availableFactories.size()]);
}

void AbilityManager::pushAbilityFactory(AbilityFactory *abilityFactory)
{
    availableFactories.push_back(abilityFactory);
}

void AbilityManager::pop_all()
{
    while (!queue.empty())
    {
        queue.pop();
    }
}

void AbilityManager::add(AbilityFactory *abilityFactory)
{
    queue.push(abilityFactory);
}

int AbilityManager::size()
{
    queue.size();
}

AbilityFactory &AbilityManager::operator[](int index)
{
    std::queue<AbilityFactory *> copy = queue;
    for (int i = 0; i <= index; i++)
    {
        if (i == index)
        {
            return *(copy.front());
        }
        else
        {
            copy.pop();
        }
    }
}