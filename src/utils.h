#pragma once
#include <iostream>

int clamp(int val, int lbd, int rbd);
int randomInt(int min, int max);

struct Position
{
    friend std::istream &operator>>(std::istream &is, Position &position);
    int x;
    int y;
    Position(int x, int y);
    Position();
};
