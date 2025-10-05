#pragma once

#include <stdexcept>
#include "../libs/json.hpp"

#include <iostream>
#include <fstream>

class FileWrapper
{
private:
    std::fstream file;

public:
    FileWrapper(const std::string &fileName);

    ~FileWrapper();
    void read(nlohmann::json &j);
    void write(nlohmann::json &j);
};