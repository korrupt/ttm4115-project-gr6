from stmpy import Machine, Driver
import logging

class Charger:
    def __init__(self):
        pass

    def chargingStarted(self):
        self.stm.send("start")
        logging.info("Charging started")

    def chargingEnded(self):
        self.stm.send("end")
        logging.info("Charging ended")

    def chargerDown(self):
        self.stm.send("down")
        logging.info("Charger down")

    def chargerDownWhileInUse(self):
        pass

    def chargerRepaired(self):
        self.stm.send("repaired")
        logging.info("Charger fixed")

    def logStarted(self):
        logging.info("Actually started")

charger = Charger()

t_init = {'source': 'initial',
        'target': 'idle'
      }

t_start = {'trigger': 'start',
          'source': 'idle',
          'target': 'active',
          'effect': 'logStarted()'
          }

t_end = {'trigger': 'end',
          'source': 'active',
         'target': 'idle'
         }

t_idle_down = {'trigger': 'down',
                'source': 'idle',
               'target': 'down'
               }

t_active_down = {'trigger': 'down',
                'source': 'active',
                 'target': 'down'
                 }

t_repaired = {'trigger': 'repaired', 
              'source': 'down',
              'target': 'idle'
              }

stm_charger = Machine(name='stm_charger', transitions=[t_init, t_start, t_end, t_idle_down, t_active_down, t_repaired], obj=charger)
charger.stm = stm_charger

logger = logging.getLogger('stmpy.Driver')
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)

logger = logging.getLogger('stmpy.Machine')
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)

logging.getLogger().setLevel(logging.INFO)
    
driver = Driver()
driver.add_machine(stm_charger)
driver.start()

def test_charger():
    charger.chargingStarted()
    charger.chargingEnded()
    charger.chargerDown()
    charger.chargerRepaired()
    charger.chargingStarted()
    charger.chargerDown()
    print("Done")

test_charger()