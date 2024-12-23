#include <cstdlib>
#include "utils.h"
#include <limits>

int clamp(int val, int lbd, int rbd)
{
    if (val < lbd)
        val = lbd;
    else if (val > rbd)
        val = rbd;
    return val;
}

int randomInt(int min, int max)
{
    int range = max - min + 1;
    return std::rand() % range + min;
}

Position::Position(int x, int y) : x(x), y(y) {};
Position::Position() : x(0), y(0) {};

std::istream &operator>>(std::istream &is, Position &position)
{
    int x = 0;
    int y = 0;

    if (!(is >> x >> y))
    {
        is.clear();
        is.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

        throw std::runtime_error("Некорректный ввод координат.");
    }

    position = {x, y};
    return is;
}