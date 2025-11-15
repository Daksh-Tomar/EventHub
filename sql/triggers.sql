DELIMITER $$

CREATE TRIGGER after_registration_insert
AFTER INSERT ON registration
FOR EACH ROW
BEGIN
    UPDATE event
    SET registered_count = registered_count + 1
    WHERE event_id = NEW.event_id;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_registration_delete
AFTER DELETE ON registration
FOR EACH ROW
BEGIN
    UPDATE event
    SET registered_count = registered_count - 1
    WHERE event_id = OLD.event_id;
END$$

DELIMITER ;
