#include "Orientation.h"
#include <limits>

Orientation::Orientation() : orientation(Orientations::Down) {}
Orientation::Orientation(Orientations orientation) : orientation(orientation) {}
void Orientation::set(Orientations orientation)
{
    this->orientation = orientation;
}

Orientations Orientation::get() { return orientation; }

std::istream &operator>>(std::istream &is, Orientation &orientation)
{
    char ch = '\0';
    std::cout << "Input the orientation of ship: (you can choose between l, u, r, d)\n";
    if (!(is >> ch))
    {
        is.clear();
        is.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        throw std::runtime_error("Invalid orientation entered.");
    }

    switch (ch)
    {
    case 'l':
        orientation.set(Orientations::Left);
        break;
    case 'u':
        orientation.set(Orientations::Up);
        break;
    case 'r':
        orientation.set(Orientations::Right);
        break;
    case 'd':
        orientation.set(Orientations::Down);
        break;
    default:
        is.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        throw std::runtime_error("Invalid orientation entered.");
    }

    return is;
}