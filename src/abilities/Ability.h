#pragma once

class Ability
{
public:
    virtual bool use() = 0;
    virtual ~Ability() {};
};
