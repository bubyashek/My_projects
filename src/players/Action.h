#pragma once
#include <iostream>

enum Actions
{
    Attack,
    UseSkill,
    SaveGame,
    LoadGame,
};

class Action
{
    friend std::istream &operator>>(std::istream &is, Action &action);

    Actions action;

public:
    Action();
    Action(Actions action);
    void set(Actions action);
    Actions get();
};