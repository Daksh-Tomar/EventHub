-- Increase count
CREATE TRIGGER trg_increment_registered_count
AFTER INSERT ON registration
FOR EACH NEW ROW
UPDATE event SET registered_count = registered_count + 1
WHERE event_id = NEW.event_id;

-- Decrease count
CREATE TRIGGER trg_decrement_registered_count
AFTER DELETE ON registration
FOR EACH OLD ROW
UPDATE event SET registered_count = registered_count - 1
WHERE event_id = OLD.event_id;