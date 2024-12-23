#include "Action.h"
#include <limits>

Action::Action() : action(Actions::Attack) {}
Action::Action(Actions action) : action(action) {}
void Action::set(Actions action)
{
    this->action = action;
}

Actions Action::get() { return action; }

std::istream &operator>>(std::istream &is, Action &action)
{
    char ch = '\0';
    std::cout << "Choose action:\na - attcak\ne - use skill\ns - save game\nl - load game\n";
    if (!(is >> ch))
    {
        is.clear();
        is.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        throw std::runtime_error("Invalid action entered.");
    }

    switch (ch)
    {
    case 'a':
        action.set(Actions::Attack);
        break;
    case 'e':
        action.set(Actions::UseSkill);
        break;
    case 's':
        action.set(Actions::SaveGame);
        break;
    case 'l':
        action.set(Actions::LoadGame);
        break;
    default:
        is.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        throw std::runtime_error("Invalid action entered.");
    }

    return is;
}