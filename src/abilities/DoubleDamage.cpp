#include "DoubleDamage.h"

DoubleDamage::DoubleDamage(BattleField &battleField) : battleField(&battleField) {}

bool DoubleDamage::use()
{
    battleField->setDoubleDamageFlag(true);
    return true;
}
