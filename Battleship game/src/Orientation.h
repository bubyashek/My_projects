#pragma once
#include <iostream>

enum Orientations
{
    Up,
    Down,
    Left,
    Right,
};

class Orientation
{
    friend std::istream &operator>>(std::istream &is, Orientation &orientation);

    Orientations orientation;

public:
    Orientation();
    Orientation(Orientations orientation);
    void set(Orientations orientation);
    Orientations get();
};